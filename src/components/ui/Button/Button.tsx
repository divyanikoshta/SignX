import styled, { css } from 'styled-components';


type ButtonVariant = 'primary' | 'tertiary';
type ButtonSize = 'small' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ButtonSize;
  disabled?: boolean;
}

interface StyledButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  small: css`
    padding: 0.5rem 1rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
  `,
};

const IconWrapper = styled.span`
     & > svg {
        height: 1rem;
        width: 1rem
    }`
  ;

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background-color: var(--primary-color);
    color: white;
  `,
  tertiary: css`
    background-color: var(--tertiary-color);
    color: white;
  `,
};

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex; 
  align-items: center;  
  gap: 0.5rem; 
  border-radius: 4px;
  cursor: pointer;

  ${({ variant = 'primary' }) => variantStyles[variant]}
  ${({ size = 'small' }) => sizeStyles[size]}
   ${({ disabled, variant }) =>
    disabled && variant === 'primary' &&
    css`
      background-color: #e5e7eb !important; /* light gray */
      color: #6b7280 !important; /* dark gray */
      opacity: 1;
      cursor: not-allowed;
      pointer-events: none;
    `}
  ${({ disabled, variant }) =>
    disabled && variant !== 'primary' &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', leftIcon, rightIcon, size = "small", disabled, ...rest }) => {
  return (
    <StyledButton variant={variant} size={size} disabled={disabled}{...rest}>
      {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      {children}
      {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};

export default Button;