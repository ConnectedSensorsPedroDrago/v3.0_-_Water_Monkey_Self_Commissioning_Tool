async function convertToMeters(value, unit) {
  if (unit === "m3") return Number(value);
  if (unit === "liters") return Number(value) * 0.001;
  if (unit === "gallons") return Number(value) * 0.00378541;
  return null; // Or throw an error for unknown units
}

async function fetchUbidotsVariable(deviceId, variableLabel, authToken) {
  const response = await fetch(
    `https://cs.ubidots.site/api/v2.0/variables/?label__in=${variableLabel}&fields=label,lastValue,device&device__label__in=${deviceId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": authToken,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    const message = data.detail || `Failed to fetch ${variableLabel}`;
    throw new Error(message);
  }
  return data;
}

async function calculateVolumePerPulse(payload) {
  const response = await fetch(
    "http://localhost:3000/api/comm-tool/step-3-calculate-volume-per-pulse",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const data = await response.json();
  if (!response.ok || data.status === "error") {
    const message = data.message || "Failed to calculate volume per pulse";
    throw new Error(message);
  }
  return data.data;
}

async function updateUbidotsDeviceProperties(deviceId, properties, authToken) {
  const response = await fetch(`https://cs.api.ubidots.com/api/v2.0/devices/~${deviceId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": authToken,
    },
    body: JSON.stringify({ properties }),
  });
  const data = await response.json();
  if (!response.ok || !data.label || data.label !== deviceId) {
    const message = data.message || "Failed to update device properties";
    throw new Error(message);
  }
  return data;
}

async function clearUbidotsVariable(deviceId, variableLabel, authToken) {
  const response = await fetch(`https://cs.api.ubidots.com/api/v1.6/devices/${deviceId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": authToken,
    },
    body: JSON.stringify({ [variableLabel]: 0 }),
  });
  const data = await response.json();
  if (!response.ok || !data[variableLabel] || data[variableLabel][0]?.status_code !== 201) {
    const message = data.message || `Failed to clear ${variableLabel}`;
    throw new Error(message);
  }
  return data;
}

export async function POST(req) {
  try {
    const {
      meterType,
      lowSideSecond,
      dateSecond,
      lowSideSecondUnit,
      picSecond,
      highSideSecond,
      highSideSecondUnit,
      picURL,
      params,
      commStage,
      propertyType,
    } = await req.json();

    // Validate required fields
    if (!lowSideSecond || !dateSecond || !lowSideSecondUnit || !picSecond || (meterType === "Compound" && (!highSideSecond || !highSideSecondUnit))) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Please complete all the required fields to submit the second readings",
        })
      );
    }

    const firstLowToCompare = await convertToMeters(commStage.first.low, commStage.first.low_unit);
    const secondLowToCompare = await convertToMeters(lowSideSecond, lowSideSecondUnit);

    let firstHighToCompare = null;
    let secondHighToCompare = null;

    if (meterType === "Compound") {
      firstHighToCompare = await convertToMeters(commStage.first.high, commStage.first.high_unit);
      secondHighToCompare = await convertToMeters(highSideSecond, highSideSecondUnit);
    }

    const isNotResidential = propertyType !== "Residential - Single Family Home";
    const notEnoughFlowMessage =
      "Not enough water has flown through the meter. Please let more time go by and make sure that at least 10m3 (or it's equivalent) of water has flown through the meter. If the meter is Compound, 10m3 (or it's equivalent) should flow per side.";
    const minFlowThreshold = 10;

    if (isNotResidential && secondLowToCompare - firstLowToCompare < minFlowThreshold) {
      return new Response(JSON.stringify({ status: "error", message: notEnoughFlowMessage }));
    }

    if (isNotResidential && meterType === "Compound" && secondHighToCompare - firstHighToCompare < minFlowThreshold) {
      return new Response(JSON.stringify({ status: "error", message: notEnoughFlowMessage }));
    }

    try {
      const ubidotsData = await fetchUbidotsVariable(params.id, "tc_p,tc_s", process.env.UBIDOTS_AUTHTOKEN);

      if (ubidotsData.count === 2) {
        const tc_p_exists = ubidotsData.results.some((x) => x.label === "tc_p" && Number(x.lastValue.value) >= 0);
        const tc_s_exists = ubidotsData.results.some((x) => x.label === "tc_s" && Number(x.lastValue.value) >= 0);

        if ((meterType === "Single" && tc_p_exists) || (meterType === "Compound" && tc_p_exists && tc_s_exists)) {
          const newLowSideSecond = await convertToMeters(lowSideSecond, lowSideSecondUnit);
          const newHighSideSecond = meterType === "Compound" ? await convertToMeters(highSideSecond, highSideSecondUnit) : null;

          const calculatePayload = {
            meterType,
            label: params.id,
            commStage: {
              stage: "second reading",
              first: commStage.first,
              second:
                meterType === "Single"
                  ? { date_time: dateSecond, low: lowSideSecond, low_unit: lowSideSecondUnit, pic: picURL }
                  : {
                      date_time: dateSecond,
                      low: lowSideSecond,
                      low_unit: lowSideSecondUnit,
                      high: highSideSecond,
                      high_unit: highSideSecondUnit,
                      pic: picURL,
                    },
            },
          };

          const calculationResult = await calculateVolumePerPulse(calculatePayload);

          const deviceProperties = {
            final_meter_reading_primary: Number(newLowSideSecond),
          };
          if (meterType === "Compound") {
            deviceProperties.final_meter_reading_secondary = Number(newHighSideSecond);
            deviceProperties.secondary_pulse_volume = calculationResult.secondary_volume_per_pulse;
          }
          deviceProperties.primary_pulse_volume = Number(calculationResult.primary_volume_per_pulse);

          await updateUbidotsDeviceProperties(params.id, { ...deviceProperties }, process.env.UBIDOTS_AUTHTOKEN);

          await clearUbidotsVariable(params.id, "wu_s", process.env.UBIDOTS_AUTHTOKEN);

          const updatedCommStage = {
            stage: "second reading",
            first: commStage.first,
            second:
              meterType === "Single"
                ? { date_time: dateSecond, low: lowSideSecond, low_unit: lowSideSecondUnit, pic: picURL }
                : {
                    date_time: dateSecond,
                    low: lowSideSecond,
                    low_unit: lowSideSecondUnit,
                    high: newHighSideSecond,
                    high_unit: highSideSecondUnit,
                    pic: picURL,
                  },
          };

          await updateUbidotsDeviceProperties(
            params.id,
            { commission_stage: JSON.stringify(updatedCommStage) },
            process.env.UBIDOTS_AUTHTOKEN
          );

          return new Response(JSON.stringify({ status: "ok", commission_stage: updatedCommStage }));
        } else {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "There was an error writing the second readings: 'tc_p and/or tc_s value missing'. Please try again or contact support.",
            })
          );
        }
      } else {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "There was an error writing the second readings: 'tc_p and/or tc_s value missing'. Please try again or contact support.",
          })
        );
      }
    } catch (error) {
      console.error("Error during processing:", error);
      return new Response(
        JSON.stringify({
          status: "error",
          message: `There was an error writing the second readings: ${error.message}. Please try again or contact support.`,
        })
      );
    }
  } catch (error) {
    console.error("Error during request parsing:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: `There was an error processing the request: ${error.message}.`,
      })
    );
  }
}