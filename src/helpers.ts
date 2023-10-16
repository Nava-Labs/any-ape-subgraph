import { Address, BigInt, BigDecimal } from '@graphprotocol/graph-ts'
export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')
export let ZERO_BD = BigDecimal.zero()
export let ONE_BD = BigDecimal.fromString('1')
export let ZERO_BI = BigInt.zero()
export let ONE_BI = BigInt.fromString('1')
export const launchpad_receipt_address = Address.fromString('0xd16280C1F7E038799fd2a1C7c3F2d330011A0f29')
export const TO_DECIMAL_18 = BigDecimal.fromString(
  BigInt.fromI64(10)
    .pow(12)
    .toString()
)
export const FACTORY_ADDRESS = '0x2Ae8Fa1D12288f7A8823AAa26bB491A0Ad834F84'

export function convertWithoutDecimals(amount: BigDecimal, decimal: BigInt): BigDecimal {
  let denominator = BigDecimal.fromString(
    BigInt.fromI64(10)
      .pow(decimal.toI32() as u8)
      .toString()
  )
  return amount.div(denominator)
}
