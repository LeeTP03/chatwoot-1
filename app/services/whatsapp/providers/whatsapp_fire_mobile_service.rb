class Whatsapp::Providers::WhatsappFireMobileService < Whatsapp::Providers::BaseService
  def send_message(phone_number, message)
    Rails.logger.info 'Entered send_message method------'
    if message.attachments.present?
      Rails.logger.info 'Entered send_attachment_message method------'
      send_attachment_message(phone_number, message)
    elsif message.content_type == 'input_select'
      Rails.logger.info 'Entered send_interactive_text_message method------'
      send_interactive_text_message(phone_number, message)
    else
      Rails.logger.info 'Entered send_text_message method------'
      send_text_message(phone_number, message)
    end
  end

  def send_template(phone_number, template_info)
    Rails.logger.info "Entered send_template method------#{template_info[:parameters]}"

    response = HTTParty.post(
      'https://apis.rmlconnect.net/wba/v1/messages',
      headers: api_headers,
      body: {
        'phone': '+' + phone_number,
        'enable_acculync': true,
        'media': {
          'type': 'media_template',
          'lang_code': template_info[:lang_code],
          'template_name': template_info[:name]
        }
      }.to_json
    )
    process_response(response)
  end

  def sync_templates
    # ensuring that channels with wrong provider ig wouldn't keep trying to sync templates
    whatsapp_channel.mark_message_templates_updated
    response = HTTParty.get("#{api_base_path}/templates", headers: api_headers, follow_redirects: true)
    whatsapp_channel.update(message_templates: response['data'], message_templates_last_updated: Time.now.utc) if response.success?
  end

  def validate_provider_config?
    response = HTTParty.get("#{api_base_path}/templates", headers: api_headers, follow_redirects: true)
    response.success?
  end

  def api_headers
    { 'Authorization' => whatsapp_channel.provider_config['api_key'], 'Content-Type' => 'application/json', 'Accept' => 'application/json' }
  end

  def media_url(media_id)
    "#{api_base_path}/media/#{media_id}"
  end

  private

  def api_base_path
    # provide the environment variable when testing against sandbox : 'https://waba-sandbox.360dialog.io/v1'
    ENV.fetch('FIREMOBILE_BASE_URL', 'https://apis.rmlconnect.net/wba')
  end

  def whatsapp_reply_context(message)
    reply_to = message.content_attributes[:in_reply_to_external_id]
    return nil if reply_to.blank?

    {
      message_id: reply_to
    }
  end

  def send_text_message(phone_number, message)
    # if message is a reply then we need to send the reply id
    Rails.logger.info "Inside send_text_message method------ #{phone_number} --- #{message.content}"
    # Rails.logger.info "INREPLYTO #{whatsapp_reply_context(message)[:message_id]}------"
    response = HTTParty.post(
      'https://apis.rmlconnect.net/wba/v1/messages',
      headers: api_headers,
      body: {
        'phone': '+' + phone_number,
        'text': message.content,
        'enable_acculync': true
      }.to_json
    )
    process_response(response)
  end

  def send_attachment_message(phone_number, message)
    attachment = message.attachments.first
    media_type = %w[image audio video].include?(attachment.file_type) ? attachment.file_type : 'document'
    Rails.logger.info "Download url: #{attachment.file_url}------"
    Rails.logger.info "Media type: #{media_type}------"
    Rails.logger.info "ATTACHMENT TYPE: #{attachment.file.filename}------"

    media_body = {
      'type': media_type,
      'url': attachment.download_url,
      'file': attachment.file.filename
    }

    Rails.logger.info media_body

    response = HTTParty.post(
      'https://apis.rmlconnect.net/wba/v1/messages',
      headers: api_headers,
      body: {
        'phone': '+' + phone_number,
        'enable_acculync': true,
        'media': media_body
      }.to_json
    )
    Rails.logger.info "Response: #{response}------"
    process_response(response)
  end

  def process_response(response)
    if response.success?
      response['id']
    else
      Rails.logger.error response.body
      nil
    end
  end

  def template_body_parameters(template_info)
    {
      'type': template_info[:type],
      'lang_code': template_info[:lang_code],
      'template_name': template_info[:template_name]
    }
  end

  def send_interactive_text_message(phone_number, message)
    payload = create_payload_based_on_items(message)

    response = HTTParty.post(
      "#{api_base_path}/v1/messages",
      headers: api_headers,
      body: {
        phone: phone_number,
        media: payload
      }.to_json
    )

    process_response(response)
  end
end
