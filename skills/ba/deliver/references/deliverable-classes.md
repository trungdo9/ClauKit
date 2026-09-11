# Deliverable classes (D-11 and D-13)

## The two classes

A composed deliverable must be tracked to the team: every byte is a fact about the entity tree and the
decisions made over it. Yet not every document is a pure function of the tree.

D-11 splits by class rather than bending:

| Class | Actions | Rule |
|---|---|---|
| `derived` | `scope` · `release-notes` | Overwritten on every run · **byte-stable** over an unchanged tree · no timestamp · never hand-edited · wave-2 `qc drift` applies (`render(ctx) == committed bytes`, else DRIFT). |
| `owned` | `uat` · `acceptance` · `golive` · `handover` | **Seeded once.** The generator **refuses to overwrite an existing file** and exits 1 naming `--force`. After the seed the human owns the file; `qc drift` must skip it. The *seed* is byte-stable, which is what Gate 3 measures. |

Both classes are **committed** — D-11's four reasons apply unchanged to a billing document, and argument 1
(*exact bytes are the contract*) applies to an `owned` file more strongly than to a `derived` one.

## Machine-readable marker

The class is declared in a machine-readable header line at the top of every deliverable, so wave-2
`qc drift` needs no table of its own:

```markdown
<!-- ba-deliverable: <action> · class: derived|owned · nguồn: plans/ba/<project>/entities/ -->
```

- `derived` files then carry `compose`'s sentence: sinh tự động, **không sửa tay** — sửa entity rồi chạy lại.
- `owned` files carry its inverse, verbatim in the template: *Seeded bởi `/ba:deliver <action>`. Sau khi seed, file này do người dùng sở hữu — điền các ô `[TO FILL]`. Chạy lại sẽ bị từ chối; cần `--force` (và `--force` xoá nội dung đã điền).*
