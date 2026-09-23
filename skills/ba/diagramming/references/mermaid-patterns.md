# Mermaid patterns — one known-good block per type

Four minimal blocks, one per type, hand-checked against the mermaid grammar (this machine has no
`mmdc` to compile them — see the render gate in `../SKILL.md`). Copy the shape, not the content.

## The diacritic-quoting rule

Quote every node/participant label that carries a Vietnamese diacritic:
`A["Bệnh nhân chọn giờ"]`, never `A[Bệnh nhân chọn giờ]`. This is the single most common mermaid
syntax failure for this kit's output — an unquoted bracket label containing certain
punctuation-adjacent characters can break the parser; a quoted string never does. Applies to
`flowchart` node labels and `sequenceDiagram` participant aliases; `erDiagram` entity/attribute
names are plain identifiers (no diacritics, no quoting question).

## `sequence`

```mermaid
sequenceDiagram
    actor BN as "Bệnh nhân"
    participant HT as "Hệ thống"
    BN->>HT: Bấm "Xác nhận đặt lịch"
    HT-->>BN: Xác nhận thành công
```

## `flow`

```mermaid
flowchart TD
    A["Bệnh nhân chọn giờ"] --> B{"Còn trong hạn giữ chỗ?"}
    B -->|"Có"| C["Xác nhận đặt lịch"]
    B -->|"Không"| A
```

## `state`

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE
    AVAILABLE --> HOLD : chọn giờ
    HOLD --> BOOKED : xác nhận trong 10 phút
    HOLD --> AVAILABLE : hết hạn giữ chỗ
```

## `erd`

```mermaid
erDiagram
    BENH_NHAN ||--o{ LICH_HEN : dat
    BAC_SI ||--o{ KHUNG_GIO : co
    KHUNG_GIO ||--o| LICH_HEN : giu
```

## The `[UNRENDERED]` header — verbatim, every degraded artifact

Open the file with exactly this block when no renderer is reachable, so every degraded artifact
looks identical:

```
> **[UNRENDERED]** — no mermaid renderer available (`mmdc` absent on this machine). Source below is syntax-authored, not compiled. Re-run through `npx -y @mermaid-js/mermaid-cli` (or paste into a renderer that supports mermaid) before treating this as verified.
```

Then a one-line caption naming the source entities, then the ` ```mermaid ` fence.
