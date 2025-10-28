import { SelectInput } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput } from "@/constants/props";
import { MONEV_PACKAGE_ONTRACT_TYPE } from "@/constants/selectOptions";
import useLang from "@/context/useLang";
import { capitalizeWords } from "@/utils/string";
import { useState } from "react";

const SUFFIX_ID = "monev_contract_type";

export const SelectMonevPackageContractType = (
  props: Omit<Props__SelectInput, "id">
) => {
  const ID = `select_${SUFFIX_ID}`;

  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [selectOptions] = useState<Interface__SelectOption[]>(
    MONEV_PACKAGE_ONTRACT_TYPE
  );

  return (
    <SelectInput
      id={ID}
      title={capitalizeWords(l.type)}
      selectOptions={selectOptions}
      {...restProps}
    />
  );
};
