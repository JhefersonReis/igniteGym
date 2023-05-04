import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  variant?: "outline" | "solid";
}

export function Button({title, variant = 'solid' , ...rest}: Props){
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor="green.500"
      rounded="sm"
      _pressed={{
        bg: variant === "outline" ? 'gray.500' : 'green.500'
      }}
      {...rest}
    >
      <Text
        color={ variant === "outline" ? "green.500" : "white"}
        fontSize="sm"
        fontFamily="heading"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}