const isValidString = (value) =>
    typeof value === "string" && value.trim() !== "";
const isValidInteger = (value) =>
    typeof value === "number" && Number.isInteger(value) && value >= 0;
const isValidPassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/.test(value);

module.exports = { isValidString, isValidInteger, isValidPassword };