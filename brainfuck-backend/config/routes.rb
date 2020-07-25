Rails.application.routes.draw do
  post '/brainfuck', to: 'brainfuck#bfstate', as: 'bfState' # need to make script param mandatory

  post '/brainfuck/:step/step', to: 'brainfuck#step'
end
