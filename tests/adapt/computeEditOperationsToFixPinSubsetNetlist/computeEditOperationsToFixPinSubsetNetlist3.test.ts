import { test, expect } from "bun:test"
import { computeEditOperationsToFixPinSubsetNetlist } from "lib/adapt/computeEditOperationsToFixPinSubsetNetlist"
import { CircuitBuilder } from "lib/builder"

test("computeEditOperationsToFixPinSubsetNetlist1", () => {
  const target = new CircuitBuilder()
  const U = target.chip().leftpins(2).rightpins(2)

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
     U1
    ┌───┐
    ┤1 4├
    ┤2 3├
    └───┘
    "
  `)

  const template = new CircuitBuilder()
  const V = template.chip().leftpins(2).rightpins(2)
  V.pin(1).line(-2, 0).passive().line(-2, 0).label()

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
         U1
        ┌───┐
    A─R2┤1 4├
        ┤2 3├
        └───┘
    "
  `)

  const operations = computeEditOperationsToFixPinSubsetNetlist({
    chipId: template.chips[0]!.chipId,
    currentNetlist: template.getNetlist(),
    pinNumber: 1,
    targetNetlist: target.getNetlist(),
  })

  expect(operations).toMatchInlineSnapshot(`
    [
      {
        "chipId": "U1",
        "pinNumber": 1,
        "type": "clear_pin",
      },
    ]
  `)
})
