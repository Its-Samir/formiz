**Latest version has been released.**

# Formaze: An Easy Form Builder for React

Formaze is a flexible and customizable form builder for React built with `React Hook Form`, `Zod`, and `TailwindCSS`. It provides an easy way to build forms with custom validation schemas and handles complex form validation logic efficiently with proper type-safety.

-  Supports multiple field types such as `string`, `email`, `password`, `number`, `date`, and `boolean`.
-  Efficient utilization of Zod's built-in validation like `min`, `max`, `regex`, and `optional`.
-  Custom error messages.

## Installation

You can install the package via npm.
**Added latest guides, (the [Changes](#changes)), you can use latest version, if you have any issue with previous versions**

```bash
npm install formaze
```

## Quickstart

```tsx
// if you are using next.js (app router) then activate the below line "use client" directive otherwise remove it

// "use client"
import { z } from "zod";
import { makeFormSchema, createFormValidator } from "formaze";
/* pre-styled CSS (you can check the styling guide below) */
import "formaze/dist/style.css";

// create the validation schema
const formSchema = makeFormSchema({
 email: { type: "email" },
 password: { type: "password", minLength: { value: 8 } },
});

// create the form component
const Form = createFormValidator(formSchema);

export function MyForm() {
 // for TypeScript
 function handleSubmit(data: z.infer<typeof formSchema>) {
  const result = formSchema.safeParse(data);

  if (!result.success) throw new Error("Invalid inputs");

  console.log(data);
 }

 // for JavaScript
 // /**@param {import("zod").infer<typeof formSchema>} data */
 // function handleSubmit(data) {
 //  const result = formSchema.safeParse(data);

 //  if (!result.success) throw new Error("Invalid inputs");

 //  console.log(data);
 // }

 return (
  <Form onSubmit={handleSubmit}>
   <Form.Input
    label="Email"
    type="email"
    name="email"
    placeholder="Enter your email"
   />
   <Form.Input
    label="Password"
    type="password"
    name="password"
    placeholder="Enter your password"
   />
   <button
    className="rounded-md bg-blue-500 py-1 px-3 text-white hover:bg-blue-600"
    type="submit"
   >
    Submit
   </button>
  </Form>
 );
}
```

## Define Validation Schema

The makeFormSchema method allows you to define validation rules for each field in the form. You can specify field types (`string`, `email`, `password`, `number`, `date`, `boolean`) along with specific validation constraints like `minLength`, `maxLength`, `min`, `max`, `regex`, and `optional`.

```js
const formSchema = makeFormSchema({
 email: {
  type: "email",
  customMessage: "A valid email is required",
 },
 password: {
  type: "password",
  minLength: {
   value: 8,
   message: "Password must be at least 8 characters",
  },
  maxLength: {
   value: 16,
   message: "Password must be less than 16 characters",
  },
 },
 username: {
  type: "string",
  regex: {
   value: /^[a-z0-9]{3,}$/ /* only lowercase letters and numbers */,
   message: "Username must contains lowercase letters and numbers",
  },
  customMessage: "Username must not be empty",
 },
 terms: {
  type: "boolean",
  customMessage: "You must accept the terms to continue",
 },
});
```

You can also directly use `Zod` to define schema as well and pass it to the Form props created through `createFormValidator` method.

```tsx
import { z } from "zod";
import { createFormValidator } from "formaze";

const formSchema = z.object({
 email: z.string().email(),
 name: z.string().min(3, { message: "Required" }),
});

const Form = createFormValidator(formSchema);
```

### Validation options

You can specify the following validation options for each field:

-  **minLength**: Specifies the minimum length for `string` and `password` fields.
-  **maxLength**: Specifies the maximum length for `string` and `password` fields.
-  **min**: Defines the minimum value for `number` and `date` fields.
-  **max**: Defines the maximum value for `number` and `date` fields.
-  **regex**: Allows defining a regular expression pattern for string validation.
-  **optional**: Marks a field as optional.

## Styling

-  For Tailwind (pre-styled)

Follow the [Official Tailwind Docs](https://tailwindcss.com/docs/installation/framework-guides) for initializing project with vite or next.js.

You can add your own styles or import the CSS below (styled with TailwindCSS) file into the main or App component or the component where the form is being used.

```js
import "formaze/dist/style.css";
```

-  For Pure CSS, here are the CSS classes with default styles, add them to your main CSS file

```css
.form-control {
 display: flex;
 flex-direction: column;
 justify-content: center;
 gap: 1rem;
}

.form-control .form-field {
 display: flex;
 flex-direction: column;
 justify-content: center;
}

.form-control .form-field .form-input {
 padding: 10px 1rem;
 border-radius: 10px;
 border-width: 1px;
 border-color: rgb(209 213 219);
}

.form-control .form-field .form-input:focus {
 border-color: rgb(59 130 246);
 outline: none;
}

.form-control .form-field-error-text {
 color: rgb(220, 38, 38);
 font-size: 0.875rem;   
/* or */

.form-control .form-field-error {
 color: rgb(220, 38, 38);
}
```

## For Next.js (app router)

You just need to add `"use client"` directive at the top of your file where you are using this form and its related methods

```tsx
"use client";
// your code
```

## Components and methods

### `createFormValidator`

The createFormValidator function accepts an argument which is a type of zod schema and returns a Form component with built-in form validation using Zod and React Hook Form. It simplifies the creation of forms that adhere to a Zod schema for type-safe validation.

#### Argument

**formSchema: `T`**

-  Type: `T` (A Zod schema generated through makeFormSchema or directly from Zod)

#### Props of the Returned Form Component:

**schema?: `T`**

-  Type: `T` (A Zod schema) (optional)

-  Description:
   This optional schema prop defines the structure and validation rules for the form. This schema determines the expected fields, their types, and any validation logic, such as required fields, minimum/maximum values, regex etc. **NOTE: In future version this prop will be deprecated. As of now this prop is no longer needed.**

-  Example:

```tsx
const schema = makeFormSchema({
 email: { type: "email" },
 password: { type: "string", minLength: { value: 8 } },
});

const Form = createFormValidator(schema);

<Form schema={schema} />;
```

**onSubmit: `SubmitHandler<z.infer<T>>`**

-  Type: `SubmitHandler<z.infer<T>>`

-  Description:
   The onSubmit prop accepts a function that is called when the form is successfully submitted. The function receives the form's validated data as its argument, which is inferred from the makeFormSchema (using Zod) schema (z.infer<T>).

-  Example:

```tsx
const schema = makeFormSchema({
 email: { type: "email" },
 password: { type: "string" },
});

const Form = createFormValidator(schema);

const handleSubmit = (data: z.infer<typeof schema>) => {
 console.log(data); // { email: "test@example.com", password: "securePassword" }
};

<Form onSubmit={handleSubmit} />;
```

**defaultValues?: `DefaultValues<z.infer<T>>`**

-  Type: `DefaultValues<z.infer<T>>` (optional)

-  Description:
   This optional prop allows you to specify default values for the form fields. The keys should exactly match the fields defined in the makeFormSchema/Zod schema, and the values should be of the appropriate type.

-  Example:

```tsx
const schema = makeFormSchema({
 email: { type: "email" },
 password: { type: "string" },
});

const Form = createFormValidator(schema);

const defaultValues = {
 email: "example@example.com",
 password: "",
};

<Form defaultValues={defaultValues} />;
```

**children: React.ReactNode**

-  Type: `React.ReactNode`

-  Description:
   The children prop accepts form inputs and other JSX elements to be rendered inside the Form component. It specifically expects components like `Form.Input`, which is designed to integrate with the form's validation logic. The `Form.Input` component handles binding form fields to the Zod schema, ensuring that validation rules are properly applied.

You can include `Form.Input` for each form field, along with any other elements like buttons or additional form elements. The `Form.Input` automatically manages validation states based on the schema.

-  Example:

```tsx
<Form onSubmit={onSubmit} defaultValues={defaultValues}>
 <Form.Input type="email" name="email" placeholder="Email" />
 <Form.Input type="password" name="password" placeholder="Password" />
 <button type="submit">Submit</button>
</Form>
```

**mode?: ValidationMode**

-  Type: `"onBlur" | "onChange" | "onSubmit" | "onTouched" | "all"` (optional)

-  Description:
   This optional prop specifies when to trigger the validation error for wrong form inputs. Although, this option is also provided by react-hook-form.

-  Example:

```tsx
<Form mode="onBlur" />
```

**Input component of the generated Form**

**Form.Input**

The Form.Input component is a form input field that is connected to a Zod-based form schema. It ensures that the field is validated according to the rules defined in the schema.

**Props:**

name: `keyof z.infer<T>`

-  Description:
   The name of the form field, which should correspond to one of the keys in the Zod schema used in the form. This connects the input to the form's validation logic.

label: `string` (optional)

-  Description:
   A label for the form field. This is used for displaying a descriptive text for the input field.

...props: `React.InputHTMLAttributes<HTMLInputElement>`

-  Description:
   Any additional props that can be passed to an HTML input element. These props allow you to customize the input field, such as adding a placeholder, className, type, etc.

### `makeFormSchema`

The makeFormSchema is a function that generates a Zod schema based on the provided configuration. It supports various field types such as string, email, password, number, date, and boolean, along with validation rules like minLength, maxLength, regex, etc.

#### Arguments

**schemaConfig: `SchemaConfig<T>`**

-  Type: `SchemaConfig<T>`

-  Description:
   The schemaConfig defines the fields and validation rules for the schema. Each field in the config should specify its type (string, email, password, etc.), whether it is optional, and any additional validation logic, such as minLength, maxLength, or regex.

-  Example:

```tsx
const schema = makeFormSchema({
 email: { type: "email" },
 password: {
  type: "string",
  minLength: {
   value: 8,
   message: "Password must be at least 8 characters long",
  },
 },
});
```

This schema can then be passed to the Form component returned by `createFormValidator`.

## Changes

1. **(Latest) So after a long time i updated this package, as React upgraded its version, i was aware that the previous version of this package would give version compatibility errors. But now it is fixed**.

2. The `createFormValidator` has been changed and now it is accepting an argument which is a type of zod schema generated through `makeFormSchema` or directly from `Zod` and the rest of the logic will be the same as before.

In order to give proper type support for JavaScript projects and to simplify the defining process this change has been made.

**From this**

```tsx
const Form = createFormValidator<typeof formSchema>(); ❌
```

**To this**

```tsx
const Form = createFormValidator(formSchema); ✔
```

3. The Form component generated through `createFormValidator` method is now accepting an optional `mode` prop which you can read [about](#props-of-the-returned-form-component) here, and the `schema` prop of this Form component is now optional (**NOTE: In future version this prop will be deprecated. As of now this prop is no longer needed.**).

4. The name of the `useFormSchema` has been changed to `makeFormSchema`, as per React rules we cannot use hooks outside of a React Component and this naming convention was preventing it from being used outside of a React Component, but now it's been taken into consideration. You can now use it anywhere you want.

## (That's it!)
