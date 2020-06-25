# Sym Full-Stack Challenge

Our goal here will be to build an end-to-end Brainf\*\*\* (aka Brainfreeze) virtual machine. We'll break this into three parts:

- The Interpreter, which takes in a BF script and executes it
- The API, which provides an JSON interface to the Interpreter
- The Visualizer, which allows end users to hit the API and interact with the results

The Interpreter has been supplied for you. We'll walk you through how to build the API, then use it to build the Visualizer.

*n.b. If you are applying for an internship, you only need to implement one of the API or Visualizer. You may use the provided reference API if you opt to do the Visualizer.*

You do not need any background context on compilers or the BF language to complete this challenge. This is intentionally a very open-ended challenge; you will be evaluated both on your technical solutions, as well as your communication and presentation in delivering them.

## Background

> [`Brainf***`](https://en.wikipedia.org/wiki/Brainfuck) is an esoteric programming language created in 1993 by Urban Müller, and notable for its extreme minimalism.

> The language consists of only eight simple commands and an instruction pointer. While it is fully Turing complete, it is not intended for practical use, but to challenge and amuse programmers. BF simply requires one to break commands into microscopic steps.

The official [BF language spec](https://www.muppetlabs.com/~breadbox/bf/) and [Wikipedia article](https://en.wikipedia.org/wiki/Brainfuck) will be helpful.

## `Brainf***` Interpreter

Please refer to the [`interpreter`](https://github.com/symopsio/fullstack-challenge/tree/master/interpreter) folder for this section.

We have implemented a BF interpreter (as a Ruby class), which takes in a script and executes it. We will include a single test script to help demonstrate correctness, but encourage you to write more tests to get a better handle for the code.

The class is called `Brainfreeze`. The initializer accepts some keyword arguments: `input:` and `output:`, both of type [`IO`](https://ruby-doc.org/core-2.3.1/IO.html), and `id:`, a `String`.

To run a BF script, you follow a simple API: call `parse!` on a `Brainfreeze` instance with a string containing the instructions, and then `step!` through. There are also several convenience methods defined, such as `interpret!` and `as_json`. We encourage you to study the implementation before continuing.

```ruby
class BrainfreezeTester
  def initialize
    @interpreter = Brainfreeze.new(input: $stdin, output: $stdout)
  end

  def test!
    script = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
    @interpreter.interpret!(script) # prints "Hello World!\n"
  end
end
```

You will be using this code in the next step to implement an API.

## `Brainfreeze` API

We want to wrap the supplied BF interpreter in an API that will provision an instance on-demand, execute a program one call at a time, and return after each call a dump of the current memory.

Please implement this API as a modern, idiomatic Rails app. It should implement a sane schema, and allow the client to implement a full-functional BF virtual machine with nothing but the API. This means you will want to support the ability to:

- Create a new, persistent BF interpreter instance
- Provide the script to be interpreted
- Provide any input to the script
- Step through the script
- Return the state of the interpreter
- Surface any parsing or execution errors

We strongly recommend you also test and document your API, using the tools of your choice.

### Reference Implementation

To help understand this assignment, we're providing a simple reference API which parses and executes a given script. You don't have to follow the same schema, but it might be a useful starting point.

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

After processing any additional input, this endpoint steps the BF interpreter forward by `count` instructions, and returns the state. Any output thus far can be found in the state, as well as the current values for the instruction and data pointers.

## `Brainfreeze` Execution Visualizer

We now want to build an _execution visualizer_, which is a web app that executes a program step by step, and can show at any given time where we are in the program's execution (which line is being run currently), and what our memory currently looks like. An example of an execution visualizer can be found [here](https://goo.gl/nDth8B). We recommend you play with this example for a bit to get familiar with what we are trying to build.

You will use the API you built earlier, which you can host locally; there is no need to deploy it.

Build a functional, standalone React app that takes in a BF script (e.g. in a text field), shows the parsed script being executed, intelligently displays the parts of the data array which are not empty (including the string representations of the cell contents, if possible), and indicates where the instruction and data pointers are. There should be a visual indication (animations, colours, etc.) when any of these change.

This assignment is intentionally open-ended; build whatever you think is appropriate to help someone understand the execution of a BF script.

Initially, you might want to avoid scripts that require input.

## Bonus

If you write additional tests for the interpreter, please feel free to open a PR in this repo and contribute them back.

If you have time, feel free to add creative extensions to this project, such as adding an additional instruction (e.g. relative jump) to the Interpreter. Do not include your extensions in any PRs, but please call them out in your submissions.
