import { useRef, SetStateAction, Dispatch } from "react";
import {
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
} from "@mantine/core";

interface CountControlInputProps {
  value: number | undefined;
  setValue: Dispatch<SetStateAction<number | undefined>>;
}

export function CountControl({ value, setValue }: CountControlInputProps) {
  const handlers = useRef<NumberInputHandlers>();

  return (
    <Group spacing={5}>
      <ActionIcon
        size={42}
        variant="default"
        onClick={() => {
          console.log(handlers.current);
          handlers?.current?.decrement();
        }}
      >
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => setValue(val)}
        handlersRef={handlers}
        max={10}
        min={0}
        step={2}
        styles={{ input: { width: 54, textAlign: "center" } }}
      />

      <ActionIcon
        size={42}
        variant="default"
        onClick={() => {
          console.log(handlers.current);
          handlers?.current?.increment();
        }}
      >
        +
      </ActionIcon>
    </Group>
  );
}
