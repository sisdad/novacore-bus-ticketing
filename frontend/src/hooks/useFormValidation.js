import { useState } from "react";

export default function useFormValidation() {

    const [errors, setErrors] = useState({});

    const validate = (form, rules) => {

        let temp = {};

        Object.keys(rules).forEach((field) => {

            const validator = rules[field];

            const message = validator(form[field]);

            if (message)
                temp[field] = message;

        });

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    return {
        errors,
        validate,
    };
}