class CreateLaba1s < ActiveRecord::Migration[5.1]
  def change
    create_table :laba1s do |t|
      t.integer :TRSeparation
      t.integer :CarrierFrequency
      t.float :TXAntennaHeight
      t.float :RXAntennaHeight
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
