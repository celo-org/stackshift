export const E164_REGEX = /^\+[1-9][0-9]{1,14}$/;

export function validatePhoneNumber(phoneNumber:string):boolean {
  if (E164_REGEX.test(phoneNumber)) {
    return true
  }
  return false
}

export async function sendSmsVerificationToken(phoneNumber: string) {
  try {
    if (!validatePhoneNumber(phoneNumber)) {
      throw "Attempting to hash a non-e164 number: " + phoneNumber;
    }

    const data = JSON.stringify({
      to: phoneNumber,
      channel: "sms",
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TWILIO_URL}/start-verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    );
    console.log("Verification request response:", response);
  } catch (error) {
    throw `Failed SMS verification: ${error}`;
  }
}

export async function verifyToken(
  phoneNumber: string,
  receivedCode: string
): Promise<boolean> {
  try {
    const data = JSON.stringify({
      to: phoneNumber,
      code: receivedCode,
    });
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TWILIO_URL}/check-verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    const json = await response.json();
    console.log("verification response", json.success);
    return json.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}
