import { SelectInput } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput } from "@/constants/props";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import useRequest from "@/hooks/useRequest";
import { capitalizeWords } from "@/utils/string";
import { useEffect, useState } from "react";

const SUFFIX_ID = "monev_pic_division";
const ENDPOINT = `/api/master-data/pic-division/index`;

export const SelectMonevPICDivision = (
  props: Omit<Props__SelectInput, "id">
) => {
  const ID = `select_${SUFFIX_ID}`;

  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const rt = useRenderTrigger((s) => s.rt);
  const { req, loading } = useRequest({
    id: ID,
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // States
  const [selectOptions, setSelectOptions] =
    useState<Interface__SelectOption[]>();

  // Utils
  function fetch() {
    const config = {
      url: ENDPOINT,
      method: "GET",
      params: {
        limit: "all",
        without_trashed: 1,
      },
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          const newOptions = r?.data?.data?.data
            ?.map((item: any) => ({
              id: item?.id,
              label: item?.title,
            }))
            .sort((a: Interface__SelectOption, b: Interface__SelectOption) =>
              a?.label?.localeCompare(b?.label)
            );
          setSelectOptions(newOptions);
        },
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [rt]);

  return (
    <SelectInput
      id={ID}
      title={capitalizeWords(l.settings_navs.master_data.pic_division)}
      loading={loading}
      selectOptions={selectOptions}
      fetch={fetch}
      {...restProps}
    />
  );
};
