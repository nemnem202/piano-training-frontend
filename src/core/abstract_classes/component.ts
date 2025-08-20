export abstract class Component {
  public content: HTMLElement;

  constructor(typeOfContent: keyof HTMLElementTagNameMap, template: string) {
    this.content = document.createElement(typeOfContent);
    const wrapper = document.createElement("template");
    wrapper.innerHTML = template;
    const realTemplate = wrapper.content.querySelector("template");
    if (realTemplate) {
      this.content.appendChild(realTemplate.content.cloneNode(true) as HTMLElement);
    } else {
      this.content.innerHTML = template;
    }
  }
}
