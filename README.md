# Cygnifierad Advent of Code

## Katalogstruktur

Varje dags lösningar måste placeras i en katalog med motsvarande namn; `day01`, `day02`, ..., `day25`.

## Dockerfile för att mäta exekveringstid

För att vi ska kunna mäta exekveringstid behöver varje dags lösning placeras i en Dockerfile. Denna bör innehålla ett
CMD som triggar start av lösningen. Vi mäter nämligen exekveringstiden genom följande.

```
$ time docker run -e part=part1 "${dockerImage}"
```

### Miljövariabel för de två delmomenten

Som du ser i exemplet ovan hur exekveringstiden mäts så anges en miljövariabel `part`. Varje dags problem under Advent
of Code har två nivåer part1 och part2. Se exempeldagarna i detta repo för att se hur du kan lösa detta. Det viktiga för
att det ska kunna mätas är just att miljövariabeln kan sättas vid uppstart av dockercontainern för part1.

```
$ time docker run -e part=part1 "${dockerImage}"
```

Och för part2.

```
$ time docker run -e part=part2 "${dockerImage}"
```
