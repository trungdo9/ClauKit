# Sign block (shared between UAT and Acceptance)

Both `UAT-001.md` and `ACCEPTANCE-001.md` carry an identical sign block at the end. This is not a template
variation — the exact bytes and structure are load-bearing for the billing document.

## Shape

```markdown
## Ký xác nhận

| Vai trò | Họ tên | Chữ ký | Ngày |
|---|---|---|---|
| BA | [TO FILL] | [TO FILL] | [TO FILL] |
| Chủ sản phẩm (PO) — phía khách hàng | [TO FILL] | [TO FILL] | [TO FILL] |
```

## Why identical

UAT is a pass/fail record from the testing team. Acceptance is the deliverer's receipt signature over the work.
Both gate payment:

- The UAT sign block proves the client ran the tests and accepted (or rejected) the results.
- The Acceptance sign block proves the delivery recipient accepted the work as meeting the scope statement.

Deriving Acceptance's sign block from UAT's ensures they cannot disagree — both are signed in the same
document, witnessed as read by the same roles.

No hand-editing or timestamp — the signature area's exact bytes, at seed time, are what a client compares
against a printed and hand-signed copy.
