import streamlit as st
import requests

st.title("Easee Memo: AI Memory Story Generator")

topic = st.text_input("Enter the topic you want to memorize:")
backend_url = "http://127.0.0.1:8000/generate_story"

if st.button("Generate Story"):
    if not topic:
        st.warning("Please enter a topic first.")
    else:
        with st.spinner("Generating your story..."):
            try:
                response = requests.post(backend_url, json={"topic": topic}, timeout=30)
                if response.status_code == 200:
                    story = response.json().get("story", "No story generated.")
                    st.subheader("🧠 Your Memory Story:")
                    st.write(story)
                else:
                    st.error(f"Backend returned {response.status_code}: {response.text}")
            except Exception as e:
                st.error(f"Request failed: {e}")
