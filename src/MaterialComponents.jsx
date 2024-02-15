import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import "./accent.css";
import {TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";

export const MaterialButton = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-100)",
    backgroundColor: "var(--color-accent-900)",
    textTransform: "none",
    borderRadius: "50pc",
    textDecoration: "none",
    border: "1px solid var(--color-accent-900)",
    fontFamily: "Roboto, sans-serif",

    '&:hover': {
        backgroundColor: "var(--color-highlight)",
    },
    '&:disabled': {
        backgroundColor: "rgba(127, 127, 127, 0.5)",
        borderColor: "transparent",
        color: "var(--color-highlight)",
        cursor: "not-allowed",
    },
}));

export const FloatActionButton = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-100)",
    backgroundColor: "var(--color-accent-900)",
    textTransform: "none",
    borderRadius: "24px",
    textDecoration: "none",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-highlight)",
    },
}));

export const FloatActionButtonV2 = styled(Button)(({ theme }) => ({
    color: "var(--color-secondary-900)",
    backgroundColor: "var(--color-secondary-600)",
    textTransform: "none",
    borderRadius: "24px",
    textDecoration: "none",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-secondary-700)",
    },
}));

export const FloatActionButtonV3 = styled(Button)(({ theme }) => ({
    color: "var(--color-tretinary-900)",
    backgroundColor: "var(--color-tretinary-600)",
    textTransform: "none",
    borderRadius: "24px",
    textDecoration: "none",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-tretinary-700)",
    },
}));

export const FloatActionButtonV4 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-900)",
    backgroundColor: "var(--color-accent-300)",
    textTransform: "none",
    borderRadius: "24px",
    textDecoration: "none",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-accent-400)",
    },
}));

export const MaterialButtonTonal = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-900)",
    backgroundColor: "var(--color-accent-400)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "50pc",
    border: "1px solid var(--color-accent-400)",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-accent-500)",
        boxShadow: "none",
    },
}));

export const MaterialButtonText = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-900)",
    backgroundColor: "var(--color-accent-200)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "50pc",
    fontFamily: "Roboto, sans-serif",
    'MuiButtonBase-root': {
        textAlign: "left",
    },
    '&:hover': {
        backgroundColor: "var(--color-accent-300)",
        boxShadow: "none",
    },
}));

export const MaterialButtonCard = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-900)",
    backgroundColor: "var(--color-accent-300)",
    textTransform: "none",
    borderRadius: "16px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-accent-400)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    },
}));

export const MaterialButtonError = styled(Button)(({ theme }) => ({
    color: "var(--color-highlight)",
    backgroundColor: "var(--color-danger-highlight)",
    textTransform: "none",
    borderRadius: "50pc",
    border: "1px solid transparent",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        backgroundColor: "var(--color-danger)",
    },
}));

export const MaterialButtonOutlined = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-900)",
    borderColor: "var(--color-accent-900)",
    border: "1px solid var(--color-accent-900)",
    textTransform: "none",
    borderRadius: "50pc",
    fontFamily: "Roboto, sans-serif",
    '&:hover': {
        borderColor: "var(--color-highlight)",
    },
}));

export const MaterialToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    textTransform: "none",
    borderRadius: "50pc",
    fontFamily: "Roboto, sans-serif",
}));

export const MaterialToggleButton = styled(ToggleButton)(({ theme }) => ({
    textTransform: "none",
    fontFamily: "Roboto, sans-serif",
}));

export const MaterialEditText = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        fontFamily: "Roboto, sans-serif",
        color: 'var(--color-accent-900)',
    },
    '& .MuiInput-underline:after': {
        fontFamily: "Roboto, sans-serif",
        borderBottomColor: 'var(--color-accent-900)',
    },
    '& .MuiOutlinedInput-root': {
        fontFamily: "Roboto, sans-serif",
        '&.Mui-focused fieldset': {
            borderColor: 'var(--color-accent-900)',
        },
    },
    fontFamily: "Roboto, sans-serif",
}));
