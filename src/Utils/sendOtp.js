const TeleSignSDK = require("telesignsdk");
const { storeOtp, viewStoredOtps } = require("./mapstore");
const { default: axios } = require("axios");

const customerId = process.env.CUSTOMER_ID;
const apiKey = process.env.API_KEY;

if (!customerId || !apiKey) {
    throw new Error("CUSTOMER_ID and API_KEY must be defined in the environment variables.");
}

const client = new TeleSignSDK(customerId, apiKey);

// /**
//  * Validates the mobile number format.
//  * @param {string} mobile - The mobile number to validate.
//  * @returns {boolean} - True if the mobile number is valid, false otherwise.
//  */
// function isValidMobileNumber(mobile) {
//     // Simple validation: Check if the mobile number is at least 10 digits long.
//     return /^\d{10,}$/.test(mobile);
// }

// /**
//  * Sends an OTP to the specified mobile number.
//  * @param {string} mobile - The mobile number to send the OTP to.
//  * @returns {Promise<{success: boolean, message: string, otp?: number}>} - A response object indicating success or failure.
//  */
// async function sendOtp(mobile) {
//     try {
//         // Validate the mobile number
//         // if (!isValidMobileNumber(mobile)) {
//         //     console.error(`Invalid mobile number: ${mobile}`);
//         //     return {
//         //         success: false,
//         //         message: "Invalid mobile number",
//         //     };
//         // }

//         // Generate a 6-digit OTP
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         const message = `Your OTP-Verification OTP is ${otp}`;
//         const messageType = "ARN";

//         // Send the SMS using the TeleSign SDK
//         const response = await new Promise((resolve, reject) => {
//             client.sms.message(
//                 (error, responseBody) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(responseBody);
//                     }
//                 },
//                 mobile,
//                 message,
//                 messageType
//             );
//         }); 
//         // Check if the SMS was sent successfully
//         if (response.status.code !== 290) {
//             return {
//                 success: false,
//                 message: `Failed to send SMS: ${response.status.description}`,
//             };
//         }        
//             await storeOtp(mobile, otp);
//         // Return success response
//         return {
//             success: true,
//             message: "OTP sent successfully",
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: "Unable to send SMS due to an internal error",
//         };
//     }
// }

async function sendOtp(mobile) {
    try {
        const response = await axios.post(`${process.env.RAJDOOT_API_HOST}/messages/send-otp`,
            {
              recipient: mobile,
              otp_length: 6
            },
            {
              headers: {
                'x-api-id': process.env.RAJDOOT_API_ID || 'undefined',
                'x-api-key': process.env.RAJDOOT_API_KEY || 'undefined',
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.status) {
            return {
                status: 200,
                success: true,
                message: "OTP sent successfully",
            };
          }
          console.log("Response from RajDoot API:", response.data);
          
        
    } catch (error) {
        console.log("Error sending OTP:", error);
        
        console.error("Error sending OTP:", error.message);
        return {
            status: 500,
            success: false,
            message: "An error occurred while sending the OTP",
        };
        
    }
}
async function verifyOtp(mobile, otp) {
    try {
        const response = await axios.post(`${process.env.RAJDOOT_API_HOST}/messages/verify-otp`,
            {
                recipient: mobile,
                otp: otp
            },
            {
                headers: {
                    'x-api-id': process.env.RAJDOOT_API_ID || 'undefined',
                    'x-api-key': process.env.RAJDOOT_API_KEY || 'undefined',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Response from RajDoot API:", response.data);
        if (response.data.status) {
           return {
                status: 200,
                success: true,
                message: "OTP verified successfully",
            };
        } else {
            return {
                status: 500,
                success: false,
                message: "Failed to verify OTP",
                data: response.data,
            };
        }
        
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return {
            status: 500,
            success: false,
            message: "An error occurred while verifying the OTP",
        };
    }
}

module.exports = {sendOtp, verifyOtp};