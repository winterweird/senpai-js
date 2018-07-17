# act 1
```yaml
hide: Aya
```
```yaml
label: test
text: Please click me ${name} \`
font: Puritain-Bold
fontSize: 16
```

# index

```yaml
character: Aya
name: aya
displayName: Aya Shameimaru
color: Yellow
```

## Black

```yaml
show: "Aya"
x: 100
y: 100
position:
  - stageLeft
  - invisible
```

### Aya

How on this planet earth did I get *here* ...?

```yaml
show: "Aya"
position:
  - center
  - visible
```

Oh goodness, I appear to be completely lost!

```yaml
choice: "flag"
choice_1: "What on this planet ${earth} are you thinking?"
"choice_${2}": "I'll help you out! I swear!"
```