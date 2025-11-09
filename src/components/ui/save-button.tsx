import React from "react";
import styled from "@emotion/styled";
import LoadingButton from '@mui/lab/LoadingButton';


const StyledButton = styled(LoadingButton)`
  margin-top: 10px;
  font-size: ${(props: { fontSize?: string }) => props.fontSize || "18px"};
  width: ${(props: { fullWidth?: boolean }) => (props.fullWidth ? "100%" : "auto")};
  border-radius: 5px;
  background-color: --primary;
  text-transform: capitalize;
  &:hover {
    background-color: "";
  }
`;

interface IProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  variant?: "text" | "outlined" | "contained";
  children: React.ReactNode;
  fullWidth?: boolean;
  fontSize?: string;
}

const SaveButton: React.FC<IProps> = ({
  type = "button",
  onClick,
  loading = false,
  variant = "contained",
  children,
  fullWidth = true,
  fontSize,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      loading={loading}
      variant={variant}
      fullWidth={fullWidth}
      fontSize={fontSize}
    >
      {children}
    </StyledButton>
  );
};

export default SaveButton;
