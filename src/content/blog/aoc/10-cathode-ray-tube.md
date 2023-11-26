---
description: '🎄👨‍💻 Day 10: Cathode-Ray Tube'
tags:
  - aoc
title: '🎄👨‍💻 Day 10: Cathode-Ray Tube'
written: 2022-12-10 00:00:00 +0000
slug: aoc22-10
---

Despite good will and cool heads, our modeling of rope physics didn't help much. The rope bridge failed to hold, and we fell straight into the river below (there's a vague _Indiana Jones_ flavor here). We don't realize in time, and the Elves from on top signal us that they will continue on and to get in touch with them via the device we repaired a few days ago.

Well, not quite. The screen is shattered, and we can only intuit its operation: it's an old-fashioned CRT display, and maybe we can build one that will bring the device back to life.

### Part 1

The device has a 40x6 pixel screen, but first we need to figure out how to handle the CPU. We have a list of instructions (the puzzle input) that shows only two possibilities. The first, a `noop`, which requires one clock cycle and does, well, nothing. The second `addx ARG`, which requires 2 clock cycles and, **at the end of the second cycle**, sums `ARG` to the current value of an `X` register, equal to 1 at the beginning of the program. We need to compute a particular value that appears to be associated with the signal sent from the CPU to the monitor. The value of the signal is calculated only at certain checkpoints: every 40 cycles, starting from the 20th, we take the value of the `X` register and multiply it by the value of the checkpoint.

Implementing the program is quite simple. However, one must pay attention to one detail, which led me down a wrong path and was difficult to debug: the signal is calculated **during** a given cycle. I calculated it **at the end**, that is, when an `addx` instruction had just updated the register. I don't know if it was a fluke, but with the example input I could still reproduce 5 of the 6 results described in the problem text. It was not trivial to figure out where I was going wrong. I had to check the register values one by one from cycle 180 through 220 to figure out what was going on.

The key piece of the solution for Part 1 is the function that updates the register:

```python
def run(instruction, register, cycle):
    """
    Run a given istruction
    return the cycles spent in the execution,
    and the register value
    """
    if instruction == "noop":
        cycle += 1
    elif instruction.startswith("addx"):
        _, arg = instruction.strip().split()
        register += int(arg)
        cycle += 2

    return cycle, register
```

After realizing my mistake, calculating the value of the signal correctly was a matter of adding a single variable that would save the value in the register **before** it was updated at the end of the second loop of an `addx` instruction. The piece of code that runs the program is just a `for` loop plus an `if`:

```python
def part1(data):
    """Solve part 1"""
    reg = 1
    cycle = strength = 0
    check = 20
    for instruction in data:
        last_reg = reg
        cycle, reg = run(instruction, reg, cycle)

        if cycle >= check:
            strength += check * last_reg
            check += 40

```

### Part 2

No spoilers, but I have to say right away that the end result of this second part is the most beautiful and fun we have had so far. [Check out](tab:https://reddit.com/r/adventofcode/comments/zhmsg2/2022_day_10_sprites_and_not_the_elf_kind/) if you don't believe me.

Now it is time to connect the CPU and monitor. We are told that the value of the `X` register indicates the position of a 3-pixel cursor. The monitor is able to render a single pixel at each cycle. A pixel will be turned on if, at a certain cycle, its position is among those occupied by the cursor at that same time. The key point here is that it can take 2 cycles for the cursor position to update, so we need to make sure that the current pixel is always synchronized with the clock cycles.

Since the screen is 40 pixels wide, the index of the current pixel should always be between 0 and 39. We construct the image on the screen as a single array of characters 240 (pixels) long.

```python
# pixel_pos starts at 0
# we also initialized pixels to []
while pixel_pos < cycle:
	pixels.append(
		"#"
		if (pixel_pos % 40) >= last_reg - 1 and (pixel_pos % 40) <= last_reg + 1
		else "."
	)
	pixel_pos += 1
```

The last step will be to format the array into a 2D image; for this purpose, the `partition()` function we had written on Day 6 comes to rescue – see how it pays off to be able to write fairly generic code? The final result is obtained in two lines[^1]:

```python
def part2(data):
    """Solve part 2"""
    _, pixels = data # result from part1()
    screen = partition(pixels, 40) # neat, isn't it?!
    return screen
```

[^1]: To avoid re-running the entire program, I modified the standard template for the function that solves Part 2 so that it takes as an argument the array of pixels computed in Part 1. Take a look at the [complete solution on GitHub](tab:https://github.com/edoardob90/aoc2022/blob/main/10/10.py).

```
###..#..#..##..#..#.#..#.###..####.#..#.
#..#.#..#.#..#.#.#..#..#.#..#.#....#.#..
#..#.#..#.#..#.##...####.###..###..##...
###..#..#.####.#.#..#..#.#..#.#....#.#..
#.#..#..#.#..#.#.#..#..#.#..#.#....#.#..
#..#..##..#..#.#..#.#..#.###..####.#..#.
```

The letters that stand out, readable with some difficulty, are `RUAKHBEK`. This is certainly one of the most beautiful puzzles on the 2022 calendar! Undoubtedly one that deserves some kind of visualization. I will give it a try, I promise, this one will go straight into `#to/revisit` list.
