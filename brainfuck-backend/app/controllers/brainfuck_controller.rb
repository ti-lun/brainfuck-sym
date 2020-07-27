require './lib/interpreter/brainfreeze'
## A Note on Brainfuck vs. Brainfreeze:
## Brainfreeze is the INTERPRETER
## Brainfuck is the endpoint of this Brainfuck API

## Another note: for this assignment, I realize that purely, in terms of getting the functionality
## to work, I could have just created an endpoint that instantiates a Brainfreeze interpreter, saves it
## AND executes it all at the same time.
## However, breaking it apart allows for greater versatility.
class BrainfuckController < ApplicationController
    skip_before_action :verify_authenticity_token

    ### This creates a BrainfuckInstance given a Brainfuck script that is parsed by a new Brainfreeze,
    ### and saves it in the database and renders the JSON data for this newly instantiated Brainfreeze 
    def bfstate
        brainfreeze = Brainfreeze.new
        scriptFromParams = params[:script]
        if scriptFromParams
          brainfreeze.parse!(scriptFromParams)

          brainfreezeInfo = brainfreeze.as_json
          BrainfuckInstance.create!(brainfreezeInfo)
        else
          render :json => "You must include a script in your POST params."
          return
        end

        render :json => JSON::dump(brainfreeze.as_json)
    end

    ### This steps through a BrainfuckInstance by finding it in the database by an
    ### optionally specified number of times (from params[:count])
    ### it renders the resulting Brainfreeze's JSON
    def step
      brainfuckInstance = BrainfuckInstance.find_by("uuid": params[:id])
      brainfuckInstanceJson = brainfuckInstance.as_json
      
      brainfreeze = Brainfreeze.new(
        uuid: brainfuckInstanceJson["uuid"],
        input: StringIO.new(brainfuckInstanceJson["input"]),
        output: StringIO.new(brainfuckInstanceJson["output"]),
        ip: brainfuckInstanceJson["instruction_pointer"],
        dp: brainfuckInstanceJson["data_pointer"],
        data: brainfuckInstanceJson["data"],
        script: brainfuckInstanceJson["script"]
      )

      ### count is 1 by default if not found in params
      count = ((params[:count] || 1).to_i) - 1  
      for i in (0..count) do
        brainfreeze.step!
      end

      finishedBrainfreeze = brainfreeze.as_json
      BrainfuckInstance.update(
        brainfuckInstance.id,
        instruction_pointer: finishedBrainfreeze[:instruction_pointer],
        data_pointer: finishedBrainfreeze[:data_pointer],
        data: finishedBrainfreeze[:data]
      )

      render :json => JSON::dump(finishedBrainfreeze)
    end

    ### This finds all of the states that a Brainfreeze will go through from start
    ### to finish.  Renders an array of states in order in which they were stepped
    def allBfStates
      
      brainfuckInstance = BrainfuckInstance.find_by("uuid": params[:id])
      brainfuckInstanceJson = brainfuckInstance.as_json
      bfStateArray = []

      brainfreeze = Brainfreeze.new(
        uuid: brainfuckInstanceJson["uuid"],
        input: StringIO.new(brainfuckInstanceJson["input"]),
        output: StringIO.new(brainfuckInstanceJson["output"]),
        ip: brainfuckInstanceJson["instruction_pointer"],
        dp: brainfuckInstanceJson["data_pointer"],
        data: brainfuckInstanceJson["data"],
        script: brainfuckInstanceJson["script"]
      )

      ## have to parse again this because we need loops to be preprocessed...
      brainfreeze.parse!(brainfuckInstanceJson["script"].join())
      while !brainfreeze.done?
        brainfreeze.step!
        bfStateArray.push(brainfreeze.as_json.deep_dup)
      end

      render json: JSON::dump(bfStateArray)
    end
end
