import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useInView } from '../hooks/useInView';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const EMAILJS_SERVICE_ID = 'service_dln2y2n';
  const EMAILJS_TEMPLATE_ID = 'template_9dfdioc';
  const EMAILJS_PUBLIC_KEY = 'tuuMSY1QfsRzlNTFl';
  const { ref, inView } = useInView();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (err: any) {
      console.error('EmailJS 에러 상세:', err);
      const msg = err?.text || err?.message || JSON.stringify(err);
      setError(`전송 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">Contact</h2>
          <div className="section__line" />
          <p className="section__subtitle">
            프로젝트 협업이나 채용 문의 등 편하게 연락주세요! 😊
          </p>
        </motion.div>

        <div className="contact__grid">
          {/* 연락처 정보 */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="contact__info-title">함께 일해요!</h3>
            <p className="contact__info-desc">
              새로운 기회, 흥미로운 프로젝트, 또는 단순한 안부 인사도 환영합니다.
              메시지를 남겨주시면 빠르게 답변드리겠습니다.
            </p>
          </motion.div>

          {/* 폼 */}
          <motion.div
            className="contact__form-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {submitted ? (
              <motion.div
                className="contact__success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="contact__success-icon">🎉</span>
                <h3>메시지가 전송되었습니다!</h3>
                <p>빠른 시일 내에 답변드리겠습니다.</p>
                <button
                  className="btn btn--outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  다시 보내기
                </button>
              </motion.div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label htmlFor="name">이름</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="홍길동"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="contact__field">
                    <label htmlFor="email">이메일</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="contact__field">
                  <label htmlFor="subject">제목</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="문의 제목을 입력하세요"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="message">메시지</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="메시지를 입력하세요..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && (
                  <p className="contact__error">{error}</p>
                )}
                <button
                  type="submit"
                  className="btn btn--primary contact__submit"
                  disabled={loading}
                >
                  {loading ? '전송 중...' : '메시지 보내기 →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
