import { SelectInput } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput } from "@/constants/props";
import { KMIS_MATERIAL_TYPES } from "@/constants/selectOptions";
import useLang from "@/context/useLang";
import { capitalizeWords } from "@/utils/string";
import { useState } from "react";

const SUFFIX_ID = "kmis_material_type";

export const SelectKMISMaterialType = (
  props: Omit<Props__SelectInput, "id">
) => {
  const ID = `select_${SUFFIX_ID}`;

  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [selectOptions] =
    useState<Interface__SelectOption[]>(KMIS_MATERIAL_TYPES);

  return (
    <SelectInput
      id={ID}
      title={capitalizeWords(l.type)}
      selectOptions={selectOptions}
      {...restProps}
    />
  );
};
