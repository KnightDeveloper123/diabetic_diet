import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
  useFieldContext,
  type ComboboxRootProps,
} from "@chakra-ui/react"
import { useEffect } from "react"
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form"

export type ValueType = {
  label: string
  value: string
}

type CustomComboboxProps<T extends FieldValues = FieldValues> = {
  values: ValueType[]
  name: Path<T>
  control: Control<T>
  rules?: RegisterOptions<T>
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  onValueChange?: (val: string[]) => void
  styles?: ComboboxRootProps
}

const CustomCombobox = <T extends FieldValues>({
  values,
  name,
  control,
  rules,
  multiple = false,
  disabled = false,
  placeholder = "Type to search",
  onValueChange,

}: CustomComboboxProps<T>) => {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter, set } = useListCollection<ValueType>({
    initialItems: [],
    filter: contains,
  })

  const fieldContext = useFieldContext()
  const isInvalid = fieldContext?.invalid ?? false

  useEffect(() => {
    if (values.length > 0) set(values)
  }, [values, set])

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        // ✅ Build displayed text based on selection
        const inputValue = Array.isArray(field.value)
          ? field.value.length === 0
            ? ""
            : field.value.length === 1
              ? collection.items.find((i) => i.value === field.value[0])?.label ?? ""
              : `${field.value.length} selected`
          : collection.items.find((i) => i.value === field.value)?.label ?? ""

        return (
          <Combobox.Root
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            // onValueChange={(e) => field.onChange(e.value)}
            onValueChange={(e) => {
              field.onChange(e.value);
              onValueChange?.(e.value);
            }}
            value={Array.isArray(field.value) ? field.value : [field.value]}
            inputValue={inputValue}
            width="100%"
            openOnClick
            multiple={multiple}
            disabled={disabled}
            invalid={isInvalid}

          >
            <Combobox.Control>
              <Combobox.Input
                borderColor="border.secondary"
                placeholder={placeholder}
                rounded={'8px'}
              />
              <Combobox.IndicatorGroup>
                {field.value && field.value.length > 0 && <Combobox.ClearTrigger />}
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  <Combobox.Empty>No items found</Combobox.Empty>
                  {collection.items.map((item) => (
                    <Combobox.Item item={item} key={item.value}>
                      {item.label}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        )
      }}
    />
  )
}

export default CustomCombobox


// Add this at the bottom of CustomCombobox.tsx

type StandaloneComboboxProps = {
  values: ValueType[];
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const StandaloneCombobox = ({
  values,
  value = "",
  onChange,
  placeholder = "Type to search",
  disabled = false,
}: StandaloneComboboxProps) => {
  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter, set } = useListCollection<ValueType>({
    initialItems: values,   // 👈 pass directly, don't rely on useEffect timing
    filter: contains,
  });

  useEffect(() => {
    if (values.length > 0) set(values);
  }, [values, set]);

  const inputValue = values.find((i) => i.value === value)?.label ?? "";  // 👈 use values directly, not collection.items

  const handleClear = () => {
    set(values);
    onChange("");
  };

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      onValueChange={(e) => {
        const selectedValue = e.value?.[0] ?? "";
        onChange(selectedValue);
      }}
      value={value ? [value] : []}
      inputValue={inputValue}
      width="100%"
      openOnClick
      multiple={false}
      disabled={disabled}
    >
      <Combobox.Control>
        <Combobox.Input
          borderColor="border.secondary"
          placeholder={placeholder}
        />
        <Combobox.IndicatorGroup>
          {value && <Combobox.ClearTrigger onClick={() => handleClear} />}
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};
