import { Component } from "../../../core/abstract_classes/component";

export class ExerciceMagnet extends Component {
  constructor() {
    super("div", "");

    this.content.className = "exercice-magnet";

    this.content.innerHTML = `
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.625 16.5H15.125V20.625H20.625V16.5ZM6.875 16.5H1.375V20.625H6.875V16.5ZM0 11C0 8.08262 1.15893 5.28473 3.22183 3.22183C5.28473 1.15893 8.08262 0 11 0C13.9174 0 16.7153 1.15893 18.7782 3.22183C20.8411 5.28473 22 8.08262 22 11V22H13.75V11C13.75 10.2707 13.4603 9.57118 12.9445 9.05546C12.4288 8.53973 11.7293 8.25 11 8.25C10.2707 8.25 9.57118 8.53973 9.05546 9.05546C8.53973 9.57118 8.25 10.2707 8.25 11V22H0V11Z"/>
</svg>

    `;
  }
}
