# frozen_string_literal: true

require 'securerandom'
require_relative './environment'

class Brainfreeze
  class BrainfreezeError < StandardError; end
  class SyntaxError < BrainfreezeError; end
  class OutOfRangeError < BrainfreezeError; end
  class InputError < BrainfreezeError; end

  DATA_LENGTH = 30_000

  attr_reader :input, :output

  def initialize(
      uuid: SecureRandom.uuid,
      input: StringIO.new,
      output: StringIO.new,
      ip: 0,
      dp: 0,
      data: Array.new(DATA_LENGTH, 0),
      script: nil
    )
    @uuid = uuid

    @ip = ip
    @dp = dp
    @data = data

    @input = input
    @output = output

    @script = script
  end

  def parse!(script)
    @script = script.tr('^\<\>\+\-\.\,\[\]', '').split('')
    preprocess_loops
  end

  def interpret!(script)
    parse! script
    step! until done?
  end

  def done?
    @script.blank? || @ip >= @script.length
  end

  def as_json(_opts = {})
    {
      uuid: @uuid,
      done: done?,
      instruction_pointer: @ip,
      data_pointer: @dp,
      input: @input.string,
      output: @output.string,
      script: @script,
      data: @data
    }
  end

  def step!
    raise InputError unless @script.present?
    return if done?

    case @script[@ip]
    when '>'
      @dp += 1
      check_dp!
    when '<'
      @dp -= 1
      check_dp!
    when '+'
      @data[@dp] += 1
    when '-'
      @data[@dp] -= 1
    when '.'
      @output.putc @data[@dp]
    when ','
      char = @input.getc
      raise InputError, 'missing input character' if char.nil?

      @data[@dp] = char
    when '['
      if @data[@dp].zero?
        @ip = @jumps[@ip]
        return
      end
    when ']'
      unless @data[@dp].zero?
        @ip = @jumps[@ip]
        return
      end
    end

    @ip += 1
  end

  private

  def check_dp!
    raise OutOfRangeError, "#{@dp} out of data range" if @dp < 0 || @dp >= DATA_LENGTH
  end

  def preprocess_loops
    @jumps = {}
    loop_stack = []

    @script.each_with_index do |c, i|
      case c
      when '['
        loop_stack.push i
      when ']'
        start = loop_stack.pop
        raise SyntaxError, "mismatched ] at #{i}" if start.nil?

        @jumps[start] = i + 1
        @jumps[i] = start + 1
      end
    end

    raise SyntaxError, "mismatched [ at #{loop_stack.pop}" unless loop_stack.empty?
  end
end
