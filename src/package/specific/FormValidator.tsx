import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ZodSchema, z } from "zod";
import { cn } from "../_utils";
import { FormFieldProps, FormProps, InputProps } from "../../types/types";

export const createFormValidator = <T extends ZodSchema>() => {
	const Form = ({ schema, onSubmit, children, className }: FormProps<T>) => {
		const form = useForm<z.infer<T>>({
			resolver: zodResolver(schema),
			mode: "onSubmit",
		});

		return (
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn(
						"p-4 flex flex-col items-start space-y-2",
						className
					)}
				>
					{children}
				</form>
			</FormProvider>
		);
	};

	Form.Input = ({ name, label, className, ...props }: InputProps<T>) => {
		const { register } = useFormContext();

		return (
			<FormField name={name as string}>
				<FormLabel htmlFor={name as string}>{label}</FormLabel>
				<input
					id={name as string}
					{...register(name as string)}
					className={cn(
						"mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200",
						className
					)}
					{...props}
				/>
			</FormField>
		);
	};

	return Form;
};

const FormLabel = React.forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ children, htmlFor, className }, ref) => {
	return (
		<label
			ref={ref}
			className={cn("text-sm font-medium text-gray-700", className)}
			htmlFor={htmlFor}
		>
			{children}
		</label>
	);
});

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
	({ name, className, children }, ref) => {
		const {
			formState: { errors },
		} = useFormContext();

		return (
			<div
				className={`flex flex-col ${errors[name] ? "text-red-600" : ""}`}
				ref={ref}
			>
				{children}
				{errors[name] ? (
					<span className={cn("text-red-600 text-sm", className)}>
						{errors[name]?.message as string}
					</span>
				) : null}
			</div>
		);
	}
);
