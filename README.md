# Sym Full-Stack Challenge

Our goal here will be to build an end-to-end Brain\*\*\* interpreter and execution visualizer. We'll break this into three parts: the interpreter, the API, and the visualizer.

You do not need any background context on compilers or the BF language to complete this challenge.

> [`Brainf***` (or BF)](https://en.wikipedia.org/wiki/Brainfuck) is an esoteric programming language created in 1993 by Urban Müller, and notable for its extreme minimalism.

> The language consists of only eight simple commands and an instruction pointer. While it is fully Turing complete, it is not intended for practical use, but to challenge and amuse programmers. BF simply requires one to break commands into microscopic steps.

## `Brainf***` Interpreter

Please refer to the [`interpreter`](https://github.com/symopsio/fullstack-challenge/tree/master/interpreter) folder for this section.

Implement a BF interpreter (as a Ruby class), which takes in a script and executes it. We will include a single test script to help you test correctness, but encourage you to write more tests.

The official [BF language spec](https://www.muppetlabs.com/~breadbox/bf/) and [Wikipedia article](https://en.wikipedia.org/wiki/Brainfuck) will be helpful.

If you have time, feel free to add creative extensions, such as garbage-collection, or the ability to inspect, debug and step through the execution environment.

The class should be called `Brainfuck` and it should have a single public method, `interpret!`. The initializer should accept two keyword arguments: `input:` and `output:`, both of type [`IO`](https://ruby-doc.org/core-2.3.1/IO.html). `interpret!` should simply take a `String` containing the instructions of the program to execute.

```ruby
class BrainfuckTester
  def initialize
    @interpreter = Brainfuck.new(input: $stdin, output: $stdout)
  end

  def test!
    script = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
    @interpreter.interpret!(script) # prints "Hello World!\n"
  end
end
```

## `Brainf***` API

We want to wrap your BF interpreter in an API that will provision an instance on-demand, execute a program one step at a time, and return after each step a dump of the current memory.

### Reference

To help with this assignment, we provide a reference API which parses and executes a given script. You don't have to follow the same schema, but it might be a useful starting point.

**TODO(yasyf): Deploy the reference API**

#### `POST https://bf-api.symops.io/api/v1/brainfuck`

This endpoint takes one mandatory parameter, `script`, which is a string containing the BF script to be executed. It also takes an optional `input` parameter, which is used to buffer some input characters before execution begins.

The response is a representation of the state of a BF execution environment. This state contains an ID which you need to step through the execution of the script. It also contains an array representing the parsed script, and another showing the data array (this will be quite long).

```json
{
  "id": "3fd24c3b-973d-47d6-8e47-b90f7e9a4bb3",
  "done": false,
  "instruction_pointer": 0,
  "data_pointer": 0,
  "input": "",
  "output": "",
  "script": ["+", "+"],
  "data": [0, 0]
}
```

#### `POST https://bf-api.symops.io/api/v1/brainfuck/<id>/step`

This endpoint takes an optional `input` parameter: a string to be concatenated to the input buffer.

This endpoint also takes an optional `count` parameter: the number of steps to take (defaults to 1).

After processing any additional input, this endpoint steps the BF interpreter forward by one instruction, and returns the state. Any output thus far can be found in the state, as well as the current values for the instruction and data pointers.

## `Brainf***` Execution Visualizer

We want to build an _execution visualizer_, which is a web app that executes a program step by step, and can show at any given time where we are in the program's execution (which line is being run currently), and what our memory currently looks like. An example of an execution visualizer can be found [here](https://goo.gl/nDth8B). We recommend you play with this example for a bit to get familiar with what we are trying to build.

You will use the API you built earlier.

Build a functional, standalone React app that takes in a BF script (e.g. in a text field), shows the parsed script being executed, intelligently displays the parts of the data array which are not empty (including the string representations of the cell contents, if possible), and indicates where the instruction and data pointers are. There should be a visual indication (animations, colours, etc.) when any of these change.

This assignment is intentionally open-ended; build whatever you think is appropriate to help someone understand the execution of a BF script.

Initially, you might want to avoid scripts that require input.
