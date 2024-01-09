# @ubloimmo/front-util

A collection of utility types and functions

## Exported values

### Utility types

*A bunch of generics for usage in various cases. All documented using jsdoc.*

#### Function types

- `GenericFn`
- `VoidFn`
- `AsyncFn`
- `MaybeAsyncFn`
- `Predicate`

#### Primitives

- `Primitives`
- `NullishPritives`

#### Union types

- `Nullable<T>`
- `Optional<T>`
- `Nullish<T>`
- `NonNullable<T>`
- `NonOptional<T>`
- `NonNullish<T>`

#### Object generics

- `DeepRequired`
- `DeepNullish`
- `DeepNonNullable`
- `DeepNonOptional`
- `DeepNonNullish`

### Utility functions

*Some commonly used utility functions*

#### Predicates

*Functions that verify the type of a value at runtime. Type safe.*

- `isNumber()`
- `isString()`
- `isBoolean()`
- `isObject()`
- `isArray()`
- `isNull()`
- `isUndefined()`
- `isNullish()`

#### Logger

- `Logger()` factory

## Currently missing

Functions and type declarations that have yet to be added to this lib

### Product-wide scalars

- [ ] `Address`
- [ ] `Currency`
- [ ] `UUID`

### Common transformers & normalizers

- [ ] Currency parsers & transformers
  - [ ] Integer to double precision float parser
  - [ ] Double precision float to string formatter
- [ ] Address parsers & formatter
- [ ] Date parsers & formatters
- [ ] String transformers
  - [ ] To Pascal case
  - [ ] To Kebab case
  - [ ] Common regular expressions
- [ ] Object parsers, validators & transformers
  - [ ] Object value / key transformer
  - [ ] Object merge