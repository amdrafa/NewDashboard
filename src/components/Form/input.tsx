import { FormControl, FormErrorMessage, FormLabel, Input as ChakaraInput, InputProps as ChakaraInputProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from 'react-hook-form'


interface InputProps extends ChakaraInputProps{
    name: string,
    label?: string;
    error?: FieldError;
} 

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({name, label, error = null, ...rest}, ref) =>{

    

    return (
        <FormControl isInvalid={!!error}>
            {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}


            <ChakaraInput 
            name={name} 
            id={name}
            type={rest.type}
            focusBorderColor='green.500'
            bgColor="gray.900"
            variant="filled"
            size="lg"
            ref={ref}
            _hover={{
              bgColor: "gray.900"
            }}
            {...rest}
            />

            
        </FormControl>
    );
}

export const Input = forwardRef(InputBase)