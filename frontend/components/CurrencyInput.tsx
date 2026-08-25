'use client'

import { forwardRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export type CurrencyInputProps = NumericFormatProps<TextFieldProps>

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(props, ref) {
    return (
      <NumericFormat
        {...props}
        customInput={TextField}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={0}
        prefix="$ "
        allowNegative={false}
        InputProps={{
          inputProps: { inputMode: 'numeric' },
          ...props.InputProps,
        }}
        getInputRef={ref}
      />
    )
  },
)

export default CurrencyInput
