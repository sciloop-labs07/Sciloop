import gradio as gr


def sciloop(problem):
    return f"Simulated output for: {problem}"


iface = gr.Interface(fn=sciloop, inputs="text", outputs="text")
iface.launch()
