---
title: '🎄👨🏻‍💻 Day 11: Monkey in the middle'
description: 'Monkeys can be nasty when playing with them.'
slug: aoc22-11
written: 'Dec 12 2022'
tags:
  - aoc22
---

It wasn't enough to have risked our lives by falling off a rope bridge into the river flowing in the gorge below. Now we met a group of nasty monkeys who are taunting us by throwing the stuff from our backpack. As we try to figure out how to intervene, we are quite apprehensive about our belongings and assign a certain worry level to each item. The monkeys handle each object a bit and then throw it at each other based on how they see us worrying. Each monkey may show a different interest in our objects, and its actions may increase our worry level a little or a lot.

### Part 1

The notes we took on the annoying primate pastime take this form:

```text
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3
```

Each monkey examines a single item on her list, plays with it, and this will change the worry level according to the indicated operation. Then, according to the result, the monkey will choose whom to pass it to. Each turn of the game ends when all monkeys have gone through **all** the items they have. It's thus possible that one monkey will end up with no items, or that another monkey who had none at the beginning of the turn will end up with some to play with.

At first, we tell ourselves that this is not such a big deal. As long as the monkeys don't damage our stuff, we manage to keep our worry level under control. Before each monkey passes an object to another, our worry level is divided by a third.

Since it is impossible to focus on all the monkeys, we decide to focus on the two most active ones. We must then determine which of the groups are the most active after 20 rounds. They will be the ones who got their hands on the most objects.

The puzzle has an interesting input and can be approached in several ways. Perhaps complicating my life, I decided that I would use a dictionary – called `monkeys` – to keep track of each monkey and what items it has on its hands. In addition, the individual blocks of lines that describe a monkey inspired me to use regexes.

```python
import re

def parse(puzzle_input):
    """Parse input"""
    monkey_re = re.compile(
        r"Monkey (?P<idx>\d+):\n"
        r"\s+Starting items: (?P<items>.*?)\n"
        r"\s+Operation: new = (?P<op>.*?)\n\s"
        r"+Test: divisible by (?P<test>\d+)\n"
        r"\s.*true.*?(?P<true>\d+).*?(?P<false>\d+)",
        re.MULTILINE | re.DOTALL,
    )
    monkeys = {}
    puzzle_input = puzzle_input.split("\n\n")
    for monkey in puzzle_input:
        if match := monkey_re.match(monkey.strip()):
            props = match.groupdict()
            idx = props.pop("idx")
            # re-arrange items to be a list of int
            props["items"] = list(map(int, props["items"].split(", ")))
            # exctract the operation
            _op = props.pop("op").split()
            if _op[0] == _op[-1]:
                op_type = operand = None
            else:
                operand = _op[2]
                op_type = _op[1]
            # create a new monkey
            monkeys[idx] = props
            monkeys[idx]["op"] = partial(op, operand=operand, op_type=op_type)
            monkeys[idx]["count"] = 0

    return monkeys
```

The pattern is a bit complicated for those not familiar with regex[^1]. In a nutshell, it uses so-called _named groups_, so you can extract their corresponding values on the fly as a dictionary (with `.groupdict()`). The most interesting lines are as follows:

[^1]: You can try it at [this website](tab:https://regex101.com/). Copy and paste the pattern and input shown just above. Select "Python" in the "Flavor" menu on the left.

```python
# exctract the operation
_op = props.pop("op").split()
if _op[0] == _op[-1]:
	op_type = operand = None
else:
	operand = _op[2]
	op_type = _op[1]
# ...
monkeys[idx]["op"] = partial(op, operand=operand, op_type=op_type)
```

`partial` is a very useful function of the `functools` module that allows you to specialize more generic functions by fixing some of their parameters. In this case, we create one for each operation: power elevation, sum, or multiplication. The code that defines the generic function is this:

```python
def op(arg, operand=None, op_type=None):
    """Define operation"""
    if not operand:
        return arg**2
    if op_type == "*":
        return arg * int(operand)
    if op_type == "+":
        return arg + int(operand)
    return None
```

At each round of the game, each monkey will inspect and turn over to another all the elements it is holding. To answer Part 1, we need to increment the value of the `count`[^2] key, which keeps track of how many items that monkey has seen each round.

```python
def monkey_turn(monkeys, part, divisors):
    """Run a monkey game round"""
    for monkey in monkeys.values():
        while monkey["items"]:
            monkey["count"] += 1
            # perform the operation
            item = monkey["op"](monkey["items"].pop(0))
            if part == 1:
                # Part 1
                item //= 3
            # test and send item
            test, true, false = monkey["test"], monkey["true"], monkey["false"]
            if item % int(test) == 0:
                monkeys[true]["items"].append(item)
            else:
                monkeys[false]["items"].append(item)

    return monkeys
```

[^2]: As we read the input, each monkey is a dictionary to which corresponds a `count` key that is initialized to 0.

Presumably we will have to simulate the game again in Part 2, so it is worth writing a `run_game()` function:

```python
def run_game(monkeys, rounds=20, part=1):
    """Run a game"""
    counts = []
    for _ in range(rounds):
        monkeys = monkey_turn(monkeys, part, divisors)

    for monkey in monkeys.values():
        counts.append(monkey["count"])

    a, b = sorted(counts, reverse=True)[:2]

    return a * b
```

### Part 2

Here's where things get funky now. It does not seem the monkeys are going to give up their pastime any soon, and this makes us particularly anxious. This is an excuse to change two things: the values of the worry levels are no longer divided by 3 at each step, and the number of rounds will be much larger, probably `10 000`.

And what is the problem with that, we might ask? Aren't computers extremely fast machines? Sure, but they are not infinite machines, and above all, no machine can ever win against math. If we look at the input, we notice that a monkey performs the following operation: `new = old * old`. This is a rapidly exploding number, and well before we get to `10 000`, it will take a virtually infinite amount of time to square a humongous number.

The solution is to figure out what these numbers are for: we only test their divisibility by certain factors (that happen to be primes), and the result of the test determines to which monkey an object will be sent. There is a property of modular arithmetic that allows us to avoid the problem of exploding numbers. The property is this: consider a set of prime factors $\{ p_1, p_2, p_3 \}$ of which $P$ is the product, and suppose that some number $A$ is **not** divisible by $p_1$, i.e. $A \mod p_1 \ne 0$. It can be shown[^3] that $(A \mod P) \mod p_1 \ne 0$. And the same relationship applies to all $p$. The divisibility by any of the individual factors is preserved, we might say.

What we do is to take the result of the operation on each item (worry level) and compute the remainder of the division with the product of all the prime factors that in the puzzle input appear after `Test: divisible by`.

The code for the second part does not change much. It is only necessary to calculate the product of the factors and replace `item //= 3` with `item %= P`, if we call `P` the product of the prime factors. The product `P` can be calculated conveniently with the function `prod` of the `math` module:

```python
import math
divisors = math.prod(int(m["test"]) for m in monkeys.values())
```

[^3]: It's quite straightforward. If $A \mod p_1 \ne 0$ but $(A \mod P) \mod p_1 = 0$, then it would mean that $A \mod P = r = m * p_1$, where $m$ is a non-zero integer. In general, we can write an integer like $A$ as $k \cdot P + r$. If we substitute $P = p_1 \cdot p_2 \cdot p_3$ and $r = m \cdot p_1$, we get that $A = p_1 (m + k \cdot p_2 \cdot p_3)$, which means that $A$ is a multiple of the prime factor $p_1$, and that invalidates our hypothesis.
