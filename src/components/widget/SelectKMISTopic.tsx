import { SelectInput } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput } from "@/constants/props";
import useLang from "@/context/useLang";
import useRequest from "@/hooks/useRequest";
import { capitalizeWords } from "@/utils/string";
import { useEffect, useState } from "react";

const SUFFIX_ID = "kmis_topic";
const ENDPOINT = `/api/kmis/public-request/get-all-topic`;

interface Props extends Omit<Props__SelectInput, "id"> {
  topicType?: string[];
}
export const SelectKMISTopic = (props: Props) => {
  const ID = `select_${SUFFIX_ID}`;

  // Props
  const { topicType = ["Pelatihan", "Pengetahuan"], ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
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
        topicType: topicType,
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
  }, []);

  return (
    <SelectInput
      id={ID}
      title={capitalizeWords(l.topic)}
      loading={loading}
      selectOptions={selectOptions}
      fetch={fetch}
      {...restProps}
    />
  );
};
