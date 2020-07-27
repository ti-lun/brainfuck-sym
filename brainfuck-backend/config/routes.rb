Rails.application.routes.draw do
  post '/brainfuck', to: 'brainfuck#bfstate', as: 'bfState' # need to make script param mandatory

  # basically called by pressing a button on that same page.
  post '/brainfuck/:id/step', to: 'brainfuck#step'
  
  post '/brainfuck/:id/allsteps', to: 'brainfuck#allBfStates', as: 'allBfStates'
end
