Rails.application.routes.draw do
  # This grabs the initial state of the Brainfreeze interpreter.  It mandates a script to be provided
  # via params[:script]
  post '/brainfuck', to: 'brainfuck#bfstate', as: 'bfState'

  # This steps on the specific BrainfuckInstance
  post '/brainfuck/:id/step', to: 'brainfuck#step'
  
  # This grabs all of the steps needed on a specific BrainfuckInstance
  post '/brainfuck/:id/allsteps', to: 'brainfuck#allBfStates', as: 'allBfStates'
end
