require 'test_helper'

class Laba1ControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get laba1_index_url
    assert_response :success
  end

end
