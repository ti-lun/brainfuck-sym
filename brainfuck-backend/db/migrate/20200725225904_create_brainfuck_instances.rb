class CreateBrainfuckInstances < ActiveRecord::Migration[6.0]
  def change
    create_table :brainfuck_instances do |t|

      t.timestamps
      t.string    "uuid"
      t.boolean   "done"
      t.integer   "instruction_pointer"
      t.integer   "data_pointer"
      t.string    "input"
      t.string    "output"
      t.string    "script", array: true
      t.integer   "data", array: true
    end
  end
end
