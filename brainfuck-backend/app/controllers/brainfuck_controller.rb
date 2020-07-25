require './lib/interpreter/brainfreeze'

class BrainfuckController < ApplicationController

    def bfstate
        @brainfreeze = Brainfreeze.new
        if params[:script]
          @brainfreeze.parse!(params[:script])
        else
          render :json => "You must include a script in your POST params."
          return
        end

        render :json => @brainfreeze.as_json
    end

    def step
        render :json => "more data"
    end
end
