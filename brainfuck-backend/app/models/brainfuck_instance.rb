class BrainfuckInstance < ApplicationRecord
    validates   :script,
                :presence => {:message => "Please enter a script."}
end
