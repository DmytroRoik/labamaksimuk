require 'test_helper'

class Laba2ControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get laba2_index_url
    assert_response :success
  end

end
