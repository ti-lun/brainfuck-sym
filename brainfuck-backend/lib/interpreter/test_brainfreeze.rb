# frozen_string_literal: true

require 'test/unit'
require 'stringio'

require_relative './environment'
require_relative './brainfreeze'

class TestBrainfreeze < Test::Unit::TestCase
  def setup
    @out = StringIO.new
    @interpreter = Brainfreeze.new(input: $stdin, output: @out)
  end

  def test_hello_world
    script = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'
    output = "Hello World!\n"
    assert_script_output script, output
  end

  private

  def assert_script_output(script, output)
    @interpreter.interpret!(script)
    assert_equal(output, @out.string)
  end
end
