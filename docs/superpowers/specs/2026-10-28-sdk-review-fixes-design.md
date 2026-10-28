# SDK review fixes design

## Goal

Correct the user-facing TypeScript contracts found during review, preserve compatibility for generated method names, and make the release checks capable of detecting equivalent regressions.

## Scope

- Make Strategy TWAP and Chase requests accept exactly one of `size` or `positionValue`.
- Update strategy order-status filters from the obsolete `1`–`5` set to the documented `2`–`7` set.
- Introduce clean method names for generated `Get` suffixes and for the generic spread-history name. Keep every old name as a delegating alias marked `@deprecated`.
- Strengthen the remaining new-service smoke coverage to assert each method's exact path, HTTP method, and authentication requirement.
- Add compile-only type fixtures for the Strategy request and status contracts.
- Synchronize `package-lock.json` and restore the Changelog heading hierarchy.

## Public API design

Strategy request types will use a discriminated union on `strategyType`. TWAP and Chase will intersect their strategy-specific fields with an exclusive quantity union:

```ts
type SizeOrPositionValue =
  | { size: string; positionValue?: never }
  | { size?: never; positionValue: string }
```

The request and order-status types will be exported so consumers can reuse them. Runtime payloads remain unchanged: the selected fields are passed directly to `requestJson`.

The canonical method aliases will be:

| Service | Canonical method | Deprecated alias |
|---|---|---|
| `PreUpgradeService` | `getTransactionLog` | `getTransactionLogGet` |
| `PreUpgradeService` | `getDeliveryRecord` | `getDeliveryRecordGet` |
| `PreUpgradeService` | `getClosedPnl` | `getClosedPnlGet` |
| `PreUpgradeService` | `getOrderHistory` | `getOrderHistoryGet` |
| `SpreadTradeService` | `getSpreadTradeHistory` | `getHistory` |

Aliases delegate to canonical methods and therefore issue exactly one identical request.

## Tests

Work follows red-green-refactor:

1. Add compile-only fixtures that demonstrate documented `positionValue` calls and status `"7"`; also reject status `"1"` and requests containing both quantity fields.
2. Add a contract table for all methods in the eight remaining new services. Verify exact URL pathname, HTTP verb, and presence or absence of signed-request headers.
3. Run the focused tests and typecheck before implementation and confirm they fail for the intended reasons.
4. Implement the smallest source changes, rerun focused checks, then run the complete test, lint, build, smoke, and package-dry-run suite.

## Release consistency

The `0.1.2` notes will remain the newest entry but move below the top-level `# Changelog` heading. They will advertise canonical names and mention compatibility aliases. The root package version in `package-lock.json` will be updated to `0.1.2` without changing dependency versions.

## Non-goals

- Updating the separate OpenAPI repository or code generator.
- Adding runtime validation of cross-field API constraints.
- Defining response models for the newly generated endpoints.
