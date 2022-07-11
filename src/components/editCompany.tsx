import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import Modal from "react-modal";
import Link from "next/link";
import { Input } from "../components/Form/input";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import Router from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUnlockAlt } from "react-icons/fa";

type EditCompanyFormData = {
  company: string;
  cnpj: string;
  responsable_name: string;
  email: string;
  phone: number;
  hours: number;
  companyId: string;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCompanyFormSchema = yup.object().shape({
  company: yup.string().required(),
  cnpj: yup.string().required(),
  responsable_name: yup.string().required().min(4, "Minimum 6 letters."),
  email: yup.string(),
  phone: yup.number(),
  hours: yup.number(),
});

export default function EditCompany({
  setIsEditMode,
  company,
  cnpj,
  email,
  phone,
  hours: propsHours,
  responsable_name,
  companyId,
}: EditCompanyFormData) {
  const { register, handleSubmit, formState, resetField } = useForm({
    resolver: yupResolver(EditCompanyFormSchema),
  });

  const { errors } = formState;

  const handleEditCompany: SubmitHandler<EditCompanyFormData> = async ({
    cnpj,
    company,
    responsable_name,
    email,
    phone,
    hours
  }) => {
    await api
      .put("editcompany", {
        cnpj,
        company,
        responsable_name,
        email,
        phone,
        hours,
        companyId
      })
      .then((response) => {
        toast.success("company updated");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  return (
    <Box
      as="form"
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p="8"
      mt={5}
      onSubmit={handleSubmit(handleEditCompany)}
    >
      <Heading size="lg" fontWeight="normal">
        Edit company
      </Heading>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={company}
            name="company"
            label="Company"
            {...register("company")}
            error={errors.company}
            autoComplete={"off"}
          />
          <Input
            defaultValue={cnpj}
            name="cnpj"
            label="CNPJ"
            {...register("cnpj")}
            error={errors.cnpj}
            autoComplete={"off"}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={responsable_name}
            name="responsable_name"
            label="Responsable name"
            {...register("responsable_name")}
            error={errors.responsable_name}
            autoComplete={"off"}
          />
          <Input
            defaultValue={email}
            name="email"
            label="E-mail"
            {...register("email")}
            error={errors.email}
            autoComplete={"off"}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={phone}
            name="phone"
            label="Phone"
            type={"number"}
            {...register("phone")}
            error={errors.phone}
            autoComplete={"off"}
          />
          <Input
            defaultValue={propsHours}
            name="hours"
            label="Contracted hours"
            {...register("hours")}
            error={errors.hours}
            maxLength={3}
            type='number'
            autoComplete={"off"}
          />
        </SimpleGrid>
      </VStack>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          <Button
            onClick={() => {
              setIsEditMode(false);
            }}
            colorScheme="whiteAlpha"
          >
            Cancel
          </Button>
          <Button
            isLoading={formState.isSubmitting}
            type={'submit'}
            colorScheme="blue"
          >
            Save
          </Button>
        </HStack>
      </Flex>

      
    </Box>
  );
}
