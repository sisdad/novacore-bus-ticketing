// src/utils/validation.js

export const validators = {

    required(value) {
        if (value === null || value === undefined)
            return "This field is required.";

        if (typeof value === "string" && value.trim() === "")
            return "This field is required.";

        return "";
    },

    name(value) {

        if (!value.trim())
            return "This field is required.";

        if (!/^[A-Za-z ]+$/.test(value))
            return "Only letters are allowed.";

        if (value.length < 2)
            return "Minimum 2 characters.";

        return "";
    },

    email(value) {

        if (!value.trim())
            return "Email is required.";

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value))
            return "Invalid email address.";

        return "";
    },

    password(value) {

        if (!value)
            return "Password is required.";

        if (value.length < 8)
            return "Minimum 8 characters.";

        if (!/[A-Z]/.test(value))
            return "Must contain uppercase letter.";

        if (!/[a-z]/.test(value))
            return "Must contain lowercase letter.";

        if (!/[0-9]/.test(value))
            return "Must contain a number.";

        return "";
    },

    phone(value) {

        if (!value.trim())
            return "Phone number required.";

        if (!/^09\d{8}$/.test(value))
            return "Phone must be 09XXXXXXXX";

        return "";
    },

    number(value) {

        if (value === "")
            return "Required.";

        if (isNaN(value))
            return "Must be numeric.";

        return "";
    },

    select(value) {

        if (!value)
            return "Please select one.";

        return "";
    }

};