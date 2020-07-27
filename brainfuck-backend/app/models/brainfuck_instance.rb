### A BrainfuckInstance is created from the JSON of a Brainfreeze interpreter.
### It mandates that a script be provided.
class BrainfuckInstance < ApplicationRecord
    validates   :script,
                :presence => {:message => "Please enter a script."}
end
